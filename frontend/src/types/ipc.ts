export interface IPCRecommendation {
    section: string;
    title: string;
    description: string;
    applicability: string;
}

export interface IPCRecommendationsProps {
    recommendations: IPCRecommendation[];
    isLoading?: boolean;
}


