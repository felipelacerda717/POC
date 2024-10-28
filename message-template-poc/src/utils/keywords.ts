// src/utils/keywords.ts

export interface KeywordCategory {
    category: string;
    keywords: string[];
    weight: number;
}

export const keywordCategories: KeywordCategory[] = [
    {
        category: 'preço',
        keywords: [
            'valor', 'preço', 'custo', 'caro', 'barato', 
            'desconto', 'promoção', 'pagamento', 'parcelas',
            'orçamento', 'investimento', 'financeiro'
        ],
        weight: 1
    },
    {
        category: 'urgência',
        keywords: [
            'urgente', 'emergência', 'dor', 'agora', 
            'imediato', 'hoje', 'rápido', 'socorro',
            'grave', 'urgência', 'quando'
        ],
        weight: 2 // Urgência tem peso maior
    },
    {
        category: 'informação',
        keywords: [
            'dúvida', 'como', 'informação', 'funciona', 
            'explicar', 'saber', 'conhecer', 'procedimento',
            'tratamento', 'consulta'
        ],
        weight: 1
    },
    {
        category: 'saudação',
        keywords: [
            'olá', 'oi', 'bom dia', 'boa tarde', 
            'boa noite', 'hi', 'hello'
        ],
        weight: 0.5 // Saudações tem peso menor
    }
];

export const defaultTemplates = {
    preço: [
        "Entendo sua preocupação com os valores. Nossa clínica oferece diversas opções de pagamento e parcelamento. Podemos agendar uma avaliação gratuita para discutir o melhor plano para você?",
        "Trabalhamos com preços competitivos e várias formas de pagamento. Que tal agendarmos uma avaliação sem compromisso para discutirmos as melhores opções para seu caso?"
    ],
    urgência: [
        "Compreendo a urgência da sua situação. Temos horários disponíveis para emergências. Poderia me dizer mais sobre o que está sentindo?",
        "Nossa clínica está preparada para atendimentos de urgência. Vou priorizar seu caso. Pode me dar mais detalhes sobre o que está acontecendo?"
    ],
    informação: [
        "Claro! Ficarei feliz em esclarecer suas dúvidas sobre nossos tratamentos. Qual procedimento específico você gostaria de conhecer melhor?",
        "Posso te explicar detalhadamente sobre nossos procedimentos. Qual aspecto específico você gostaria de entender melhor?"
    ],
    saudação: [
        "Olá! Seja bem-vindo(a) à [Nome da Clínica]. Como posso ajudar você hoje?",
        "Olá! Que bom ter você por aqui. Em que posso ser útil?"
    ]
};