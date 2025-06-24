# CLAUDE.md - Kumorebe AI Campaign Generator

## Overview

Kumorebe is a first-to-market, strategy-first AI marketing campaign generator that transcends traditional content creation to deliver genuine strategic innovation. Unlike existing AI marketing tools that focus on tactical execution, Kumorebe thinks like a Chief Strategy Officer, identifying cultural tensions, violating industry conventions purposefully, and creating campaigns that invite participation rather than passive consumption.

## Core Philosophy

**"Think Strategy, Not Content"**

Kumorebe operates on the principle that breakthrough marketing campaigns emerge from:
- Strategic insight into cultural tensions
- Purposeful violation of category conventions
- Authentic alignment with brand values
- Participation architectures that engage audiences as co-creators
- Real-time adaptation to market dynamics

## System Architecture

```mermaid
graph TB
    subgraph "Input Layer"
        UI[User Interface]
        API[API Gateway]
        RT[Real-time Data Feeds]
    end
    
    subgraph "Intelligence Layer"
        CSE[Cultural Strategy Engine]
        RTE[Real-time Trend Engine]
        SFE[Strategic Framework Engine]
        CVE[Convention Violation Engine]
    end
    
    subgraph "Processing Layer"
        MO[Model Orchestrator]
        GR[Grok Integration]
        DI[DeepInfra Models]
        CM[Custom Models]
    end
    
    subgraph "Learning Layer"
        VDB[(Vector Database)]
        KG[(Knowledge Graph)]
        UL[Unsupervised Learning]
        PD[Pattern Detection]
    end
    
    subgraph "Output Layer"
        CG[Campaign Generator]
        SR[Strategic Reasoner]
        PA[Participation Architect]
        ER[Explainability Engine]
    end
    
    UI --> API
    API --> CSE
    RT --> RTE
    
    CSE --> MO
    RTE --> MO
    SFE --> MO
    CVE --> MO
    
    MO --> GR
    MO --> DI
    MO --> CM
    
    GR --> VDB
    DI --> VDB
    CM --> VDB
    
    VDB <--> KG
    VDB --> UL
    UL --> PD
    
    PD --> CG
    MO --> SR
    SR --> PA
    SR --> ER
    
    CG --> API
    PA --> API
    ER --> API
```

## Core Components

### 1. Cultural Strategy Engine (CSE)
Implements Douglas Holt's cultural strategy framework to identify ideological opportunities and cultural tensions that can be leveraged for breakthrough campaigns.

```mermaid
flowchart LR
    subgraph "Cultural Analysis"
        SC[Social Conversations]
        CT[Cultural Tensions]
        IO[Ideological Opportunities]
        MT[Myth Markets]
    end
    
    subgraph "Brand Analysis"
        BV[Brand Values]
        BA[Brand Archetype]
        CC[Cultural Codes]
        BP[Brand Positioning]
    end
    
    subgraph "Strategy Synthesis"
        CM[Cultural Mapping]
        OI[Opportunity Identification]
        CS[Campaign Strategy]
    end
    
    SC --> CT
    CT --> IO
    IO --> MT
    
    BV --> CC
    BA --> CC
    CC --> BP
    
    MT --> CM
    BP --> CM
    CM --> OI
    OI --> CS
```

### 2. Real-time Trend Engine (RTE)
Leverages Grok's access to live X data and DeepSearch capabilities for real-time social intelligence and trend detection.

```mermaid
flowchart TD
    subgraph "Data Sources"
        XD[X/Twitter Data]
        WS[Web Signals]
        NS[News Streams]
        SI[Social Indicators]
    end
    
    subgraph "Analysis Pipeline"
        TA[Trend Analysis]
        SA[Sentiment Analysis]
        ED[Event Detection]
        VI[Virality Indicators]
    end
    
    subgraph "Strategic Insights"
        CO[Cultural Opportunities]
        MC[Market Conditions]
        CA[Competitive Actions]
        TW[Timing Windows]
    end
    
    XD --> TA
    WS --> TA
    NS --> ED
    SI --> SA
    
    TA --> VI
    SA --> CO
    ED --> MC
    VI --> TW
    
    CO --> Output[Strategic Recommendations]
    MC --> Output
    CA --> Output
    TW --> Output
```

### 3. Strategic Framework Engine (SFE)
Integrates advanced marketing frameworks ignored by current AI tools.

```mermaid
mindmap
  root((Strategic Frameworks))
    Behavioral Economics
      Nudge Theory
      Loss Aversion
      Choice Architecture
      Framing Effects
      Social Proof
    Memetic Theory
      STEPPS Framework
      Viral Mechanics
      Network Topology
      Seeding Strategy
      Amplification Patterns
    Transmedia Storytelling
      Worldbuilding
      Spreadability
      Drillability
      Continuity
      Multiplicity
      Immersion
      Extractability
      Participation
    Cultural Strategy
      Myth Markets
      Cultural Codes
      Ideological Opportunities
      Source Materials
      Cultural Contradictions
    Complexity Theory
      Emergence
      Non-linearity
      Adaptive Systems
      Network Effects
      Feedback Loops
```

### 4. Convention Violation Engine (CVE)
Maps industry conventions and identifies strategic violation opportunities.

```mermaid
stateDiagram-v2
    [*] --> IndustryMapping
    IndustryMapping --> ConventionIdentification
    ConventionIdentification --> RigidityAssessment
    RigidityAssessment --> ViolationOpportunities
    ViolationOpportunities --> RiskAssessment
    RiskAssessment --> AlignmentCheck
    AlignmentCheck --> StrategicRecommendation
    StrategicRecommendation --> [*]
    
    IndustryMapping: Map category rules
    ConventionIdentification: Identify rigid conventions
    RigidityAssessment: Assess convention strength
    ViolationOpportunities: Generate violation ideas
    RiskAssessment: Evaluate risks/rewards
    AlignmentCheck: Check brand alignment
    StrategicRecommendation: Recommend violations
```

### 5. Model Orchestration Layer
Coordinates multiple AI models for different strategic tasks.

```mermaid
flowchart TB
    subgraph "Task Router"
        TR[Task Classification]
        MP[Model Selection]
        PP[Pipeline Planning]
    end
    
    subgraph "Grok Models"
        GS[Social Intelligence]
        GT[Trend Analysis]
        GR[Real-time Insights]
    end
    
    subgraph "DeepInfra Models"
        DR[DeepSeek R1 - Reasoning]
        QW[Qwen3 - Creative]
        LL[Llama 4 - Speed]
        CM[Custom LoRA - Brand Voice]
    end
    
    subgraph "Output Synthesis"
        RS[Result Synthesis]
        QA[Quality Assurance]
        CS[Coherence Check]
    end
    
    TR --> MP
    MP --> PP
    
    PP --> GS
    PP --> GT
    PP --> GR
    PP --> DR
    PP --> QW
    PP --> LL
    PP --> CM
    
    GS --> RS
    GT --> RS
    GR --> RS
    DR --> RS
    QW --> RS
    LL --> RS
    CM --> RS
    
    RS --> QA
    QA --> CS
```

## Database Architecture

### Vector Database + Knowledge Graph Hybrid

```mermaid
erDiagram
    CAMPAIGNS ||--o{ CAMPAIGN_VECTORS : generates
    CAMPAIGNS ||--o{ CAMPAIGN_EVENTS : tracks
    CAMPAIGNS ||--o{ PERFORMANCE_METRICS : measures
    CAMPAIGN_VECTORS ||--|| VECTOR_EMBEDDINGS : contains
    CAMPAIGN_VECTORS ||--o{ SIMILARITY_CLUSTERS : belongs_to
    KNOWLEDGE_NODES ||--o{ RELATIONSHIPS : connects
    CAMPAIGNS ||--o{ KNOWLEDGE_NODES : references
    PATTERN_LIBRARY ||--o{ DETECTED_PATTERNS : contains
    SIMILARITY_CLUSTERS ||--o{ PATTERN_LIBRARY : feeds
    
    CAMPAIGNS {
        uuid id PK
        string title
        json strategy_metadata
        timestamp created_at
        string brand_id
        string industry
    }
    
    CAMPAIGN_VECTORS {
        uuid campaign_id FK
        vector embedding
        string model_version
        json metadata
    }
    
    VECTOR_EMBEDDINGS {
        binary vector_data
        int dimensions
        string encoding_model
    }
    
    KNOWLEDGE_NODES {
        uuid node_id PK
        string node_type
        json properties
        vector embedding
    }
    
    RELATIONSHIPS {
        uuid source_id FK
        uuid target_id FK
        string relationship_type
        float weight
        json metadata
    }
    
    PATTERN_LIBRARY {
        uuid pattern_id PK
        string pattern_type
        json pattern_rules
        float confidence_score
        int occurrence_count
    }
```

## Learning Architecture

### Unsupervised Learning Pipeline

```mermaid
flowchart LR
    subgraph "Data Collection"
        CD[Campaign Data]
        PD[Performance Data]
        MD[Market Data]
        SD[Social Data]
    end
    
    subgraph "Feature Engineering"
        VE[Vector Encoding]
        FE[Feature Extraction]
        NE[Normalization]
    end
    
    subgraph "Unsupervised Learning"
        CL[Clustering<br/>K-means, DBSCAN]
        AD[Anomaly Detection<br/>Isolation Forest]
        PM[Pattern Mining<br/>Apriori, FP-Growth]
        DR[Dimensionality Reduction<br/>PCA, t-SNE]
    end
    
    subgraph "Pattern Recognition"
        BP[Breakthrough Patterns]
        CP[Convention Patterns]
        SP[Success Patterns]
        FP[Failure Patterns]
    end
    
    subgraph "Strategic Insights"
        SI[Strategic Insights]
        PR[Pattern Rules]
        RL[Recommendation Logic]
    end
    
    CD --> VE
    PD --> FE
    MD --> FE
    SD --> FE
    
    VE --> CL
    FE --> NE
    NE --> CL
    NE --> AD
    NE --> PM
    
    CL --> DR
    AD --> BP
    PM --> CP
    DR --> SP
    
    BP --> SI
    CP --> SI
    SP --> PR
    FP --> PR
    
    SI --> RL
    PR --> RL
```

## Participation Architecture Designer

```mermaid
flowchart TD
    subgraph "Participation Analysis"
        ET[Engagement Types]
        UM[User Motivations]
        PM[Participation Mechanics]
    end
    
    subgraph "Design Patterns"
        CC[Co-creation]
        UG[User-generated]
        SC[Social Challenge]
        CM[Community Building]
        GP[Gamification]
    end
    
    subgraph "Architecture Generation"
        PF[Platform Selection]
        IP[Interaction Points]
        RP[Reward Pathways]
        VL[Viral Loops]
    end
    
    subgraph "Implementation"
        TI[Technical Integration]
        MI[Measurement Integration]
        FI[Feedback Integration]
    end
    
    ET --> CC
    UM --> UG
    PM --> SC
    
    CC --> PF
    UG --> IP
    SC --> RP
    CM --> VL
    GP --> VL
    
    PF --> TI
    IP --> MI
    RP --> FI
    VL --> FI
```

## API Structure

```mermaid
sequenceDiagram
    participant Client
    participant API Gateway
    participant Auth Service
    participant Campaign Engine
    participant Model Orchestrator
    participant Database Layer
    participant Learning System
    
    Client->>API Gateway: Campaign Request
    API Gateway->>Auth Service: Validate Token
    Auth Service-->>API Gateway: Token Valid
    
    API Gateway->>Campaign Engine: Process Request
    Campaign Engine->>Model Orchestrator: Analyze Context
    
    Model Orchestrator->>Model Orchestrator: Select Models
    Model Orchestrator->>Database Layer: Retrieve Patterns
    Database Layer-->>Model Orchestrator: Historical Data
    
    Model Orchestrator->>Campaign Engine: Strategic Insights
    Campaign Engine->>Campaign Engine: Generate Campaign
    
    Campaign Engine->>Learning System: Log Campaign
    Learning System->>Database Layer: Update Patterns
    
    Campaign Engine-->>API Gateway: Campaign Response
    API Gateway-->>Client: Deliver Campaign
```

## Key Differentiators

### 1. Strategic Depth Over Content Volume
- Focuses on identifying breakthrough opportunities rather than generating variations
- Implements advanced marketing frameworks ignored by current tools
- Provides strategic reasoning transparency

### 2. Real-time Cultural Intelligence
- Continuous monitoring of cultural conversations via Grok
- Dynamic adaptation to emerging trends and events
- Predictive identification of cultural moments

### 3. Convention Violation as a Feature
- Maps industry rules and identifies violation opportunities
- Assesses risk/reward of convention breaking
- Ensures brand alignment with proposed violations

### 4. Participation-First Design
- Creates campaigns that invite co-creation
- Designs viral mechanics based on behavioral science
- Builds community activation strategies

### 5. Self-Improving Intelligence
- Learns from breakthrough campaigns automatically
- Identifies success patterns through unsupervised learning
- Evolves strategic recommendations based on outcomes

### 6. Model Diversity Advantage
- Leverages 100+ models through DeepInfra
- Assigns specialized models to specific tasks
- Maintains brand voice through custom LoRA models

### 7. Transparent Strategic Reasoning
- Shows step-by-step strategic logic
- Explains framework applications
- Builds marketer trust through transparency

## Implementation Priorities

### Phase 1: Foundation (Months 1-2)
- Implement core Grok integration for real-time data
- Set up DeepInfra model orchestration
- Build basic vector database architecture
- Create initial strategic framework libraries

### Phase 2: Intelligence (Months 3-4)
- Develop Cultural Strategy Engine
- Build Convention Violation Engine
- Implement pattern detection algorithms
- Create participation architecture templates

### Phase 3: Learning (Months 5-6)
- Deploy unsupervised learning pipeline
- Build knowledge graph relationships
- Implement breakthrough pattern recognition
- Create feedback loop mechanisms

### Phase 4: Scale (Months 7-8)
- Optimize model orchestration
- Enhance real-time capabilities
- Build comprehensive API
- Launch beta testing program

## Success Metrics

### Strategic Innovation
- Percentage of campaigns using novel approaches
- Convention violation success rate
- Cultural resonance scores
- Participation engagement metrics

### System Performance
- Strategy generation speed
- Model coordination efficiency
- Pattern recognition accuracy
- Learning system improvement rate

### Business Impact
- Campaign breakthrough rate
- Client retention metrics
- Strategic insight value scores
- Market differentiation index

## Conclusion

Kumorebe represents a paradigm shift in AI-powered marketing - from content generation to strategic innovation. By combining real-time cultural intelligence, advanced marketing frameworks, and self-improving learning systems, Kumorebe enables marketers to create campaigns that don't just communicate but catalyze cultural movements.