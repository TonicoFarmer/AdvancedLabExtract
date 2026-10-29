# ASTRAYA LAB — Arquivo de Módulos Preservados em Memória

Este documento e os arquivos de código correspondentes preservam a totalidade das subsessões de extração **ROSIN**, **DRY ICE** e **ICEOLATOR**, que foram desvinculadas da barra de navegação ativa do ASTRAYA LAB para serem implantadas futuramente em uma plataforma paralela especializada em extrações solventless / mecânicas.

---

## 1. Módulo: ROSIN (Prensagem Mecânica e Térmica / Solventless)
* **Componente:** `src/components/extractions/ExtractionRosin.tsx`
* **Tipo / Interface:** `ExtractionRosinRecord` (em `src/types/index.ts`)
* **Chave de Armazenamento Local:** `astraya_lab_rosin_v6`
* **Dados Iniciais de Teste/Calibração:** `initialRosin` (em `src/data/initialData.ts`)
* **Principais Funcionalidades Preservadas:**
  - Registro de tipo de matéria-prima (Flor curada, Trim congelado, Bubble Hash / Iceolator, Dry Sift).
  - Parâmetros físicos: Temperatura superior/inferior das placas (°C), Pressão aplicada (PSI/Toneladas), Tempo de prensagem (segundos), Micragem das bags (25µ, 37µ, 73µ, 90µ, 120µ, 160µ).
  - Cálculo automático de rendimento de resina (% Yield = Massa de Rosin / Massa de Entrada × 100).
  - Avaliação organoléptica e sensorial (cor, textura, consistência fresh press / cold cure / jam, perfil terpênico).
  - Exportação de laudo em PDF e tabela em Excel.

---

## 2. Módulo: DRY ICE (Separação Mecânica a Seco com CO₂ Sólido)
* **Componente:** `src/components/extractions/ExtractionDryIce.tsx`
* **Tipo / Interface:** `ExtractionDryIceRecord` (em `src/types/index.ts`)
* **Chave de Armazenamento Local:** `astraya_lab_dry_ice_v6`
* **Dados Iniciais de Teste/Calibração:** `initialDryIce` (em `src/data/initialData.ts`)
* **Principais Funcionalidades Preservadas:**
  - Proporção biomassa : gelo seco (kg CO₂ / g biomassa).
  - Controle de frações e micragens sequenciais (ex: 73µ Primeira Linha Ouro, 120µ Segunda Linha, 160µ/220µ Terceira Linha).
  - Tempo e intensidade de agitação mecânica (minutos).
  - Rendimento fracionado e pureza de glândulas tricômicas.
  - Exportação de relatórios técnicos em PDF e Excel.

---

## 3. Módulo: ICEOLATOR (Ice Hash / Bubble Hash com Água e Gelo)
* **Componente:** `src/components/extractions/ExtractionIceolator.tsx`
* **Tipo / Interface:** `ExtractionIceolatorRecord` (em `src/types/index.ts`)
* **Chave de Armazenamento Local:** `astraya_lab_iceolator_v6`
* **Dados Iniciais de Teste/Calibração:** `initialIceolator` (em `src/data/initialData.ts`)
* **Principais Funcionalidades Preservadas:**
  - Registro de lavagens sucessivas (1ª, 2ª, 3ª e 4ª lavagens, RPM de vórtice e tempo de batimento).
  - Controle de temperatura da água/banho (< 4°C).
  - Fracionamento por micragem de bolsas (*work bag* 220µ, *capture bags* 160µ, 120µ, 90µ, 73µ, 45µ, 25µ).
  - Método de secagem (Liofilização / Freeze Dryer vs. Microplane a frio).
  - Cálculo de rendimento total e rendimento full spectrum / melt quality (1 a 6 estrelas).
  - Exportação de laudos analíticos e tabelas em Excel.

---

## 4. Ponto de Reutilização Direta na Plataforma Paralela

Para reutilizar esses módulos na nova plataforma paralela, basta importar diretamente de `src/archive`:

```typescript
import {
  ExtractionRosin,
  ExtractionDryIce,
  ExtractionIceolator
} from './archive';
```

Ou copiar os componentes de `src/components/extractions/` mantendo as tipagens de `src/types/index.ts`.
