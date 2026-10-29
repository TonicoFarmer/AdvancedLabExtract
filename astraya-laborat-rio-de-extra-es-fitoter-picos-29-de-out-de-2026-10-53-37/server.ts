import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Cross-search AI Endpoint (PubMed, SciELO Brasil e Google Acadêmico)
  app.post("/api/ai/cross-search", async (req, res) => {
    try {
      const { query, sources } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Termo de busca é obrigatório." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "Chave GEMINI_API_KEY não configurada no ambiente.",
        });
      }

      const activeBases = Array.isArray(sources) && sources.length > 0
        ? sources.join(", ")
        : "PubMed / NCBI, SciELO Brasil, Google Acadêmico";

      const prompt = `Você é o assistente científico e pesquisador farmacotécnico sênior da ASTRAYA (Associação de Desenvolvimento e Pesquisa em Cannabis Medicinal e Farmacopeia).
O pesquisador realizou uma busca científica com o termo exato: "${query}".

Bases selecionadas ativas: ${activeBases}.

DIRETRIZES OBRIGATÓRIAS:
1. RELEVÂNCIA LÓGICA ESTRITA: Cada artigo retornado deve ser 100% DIRETAMENTE RELACIONADO ao tema "${query}". Não invente artigos genéricos ou desconexos da pergunta.
2. NÚMERO MÍNIMO DE RESULTADOS: Você DEVE retornar OBRIGATORIAMENTE entre 4 e 6 artigos científicos (NUNCA menos que 3).
3. DISTRIBUIÇÃO COERENTE: Distribua os estudos entre as bases ativas ("PubMed / NCBI", "SciELO Brasil", "Google Acadêmico").
   - Para SciELO Brasil: forneça estudos em português/espanhol ou revisões brasileiras estritamente pertinentes a "${query}".
   - Para Google Acadêmico: forneça teses, dissertações, livros ou revisões acadêmicas com foco exato em "${query}".
   - Para PubMed / NCBI: forneça ensaios clínicos, estudos pré-clínicos, cromatografia ou farmacocinética focados em "${query}".
4. LINKS DIRETOS:
   - Para PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)} (ou link direto com PMID se conhecido)
   - Para SciELO Brasil: https://search.scielo.org/?q=${encodeURIComponent(query)}
   - Para Google Acadêmico: https://scholar.google.com.br/scholar?q=${encodeURIComponent(query)}&hl=pt-BR
5. SÍNTESE EXECUTIVA: Forneça uma síntese clara, detalhada e técnica em português explicando os principais consensos científicos, mecanismos fitoquímicos/farmacológicos e recomendações práticas sobre "${query}".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesis: {
                type: Type.STRING,
                description: "Síntese científica aprofundada das evidências encontradas nas bases sobre a busca do usuário.",
              },
              studies: {
                type: Type.ARRAY,
                description: "Lista de 4 a 6 artigos científicos lógicos e relevantes sobre a consulta.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Título do artigo científico." },
                    authors: { type: Type.STRING, description: "Autores da publicação (ex: Russo E.B., Crippa J.A. et al.)." },
                    source: { type: Type.STRING, description: "Base de origem: PubMed / NCBI, SciELO Brasil ou Google Acadêmico." },
                    year: { type: Type.INTEGER, description: "Ano de publicação." },
                    doiOrUrl: { type: Type.STRING, description: "URL ou DOI de acesso direto." },
                    summary: { type: Type.STRING, description: "Resumo metodológico e resultados centrais pertinentes à busca." },
                    keyFindings: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Lista de 2 a 3 achados fundamentais do estudo.",
                    },
                  },
                  required: ["title", "authors", "source", "year", "doiOrUrl", "summary", "keyFindings"],
                },
              },
            },
            required: ["synthesis", "studies"],
          },
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        const studies = Array.isArray(parsed.studies) ? parsed.studies : [];
        res.json({
          synthesis: parsed.synthesis || `Síntese científica gerada para "${query}".`,
          studies,
          query,
          timestamp: new Date().toISOString(),
        });
      } catch (parseErr) {
        res.json({
          synthesis: responseText,
          studies: [],
          query,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error("Erro na busca cruzada com Gemini:", error);
      res.status(500).json({
        error: error?.message || "Erro ao processar consulta científica com inteligência artificial.",
      });
    }
  });

  // AI Dosage & Extraction Formulation Advisor
  app.post("/api/ai/formulation-check", async (req, res) => {
    try {
      const { resinGrams, solventVolumeMl, molecule, currentTCheck, targetMgMl } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "Chave GEMINI_API_KEY não configurada no ambiente.",
        });
      }

      const prompt = `Você é o farmacêutico responsável do laboratório ASTRAYA.
Analise os seguintes parâmetros de extração/diluição e forneça um parecer técnico e validação de cálculos:
- Molécula principal: ${molecule || "CBD / THC"}
- Massa de Resina: ${resinGrams} g
- Volume de Veículo (TCM / Óleo Carreador): ${solventVolumeMl} mL
- Concentração T-Check obtida: ${currentTCheck || "Não informado"} mg/mL
- Concentração Alvo desejada: ${targetMgMl || "Não informado"} mg/mL

Forneça:
1. Verificação da proporção resina/veículo.
2. Cálculo estimado de concentração mg/mL e dosagem por gota (considerando 1 mL = ~20 a 30 gotas).
3. Homogeneização e estabilidade do fitocomplexo.
4. Parecer de liberação do lote de acordo com Boas Práticas de Manipulação Farmacêutica.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({
        analysis: response.text || "",
      });
    } catch (error: any) {
      console.error("Erro no parecer de formulação:", error);
      res.status(500).json({
        error: error?.message || "Erro ao gerar parecer técnico.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASTRAYA Laboratory Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
