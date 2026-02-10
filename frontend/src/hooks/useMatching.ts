import { useQuery, useMutation } from '@tanstack/react-query';
import { matching } from '../services/api';

export const useInvestors = () => useQuery({ queryKey: ['investors'], queryFn: matching.getInvestors });
export const useOpportunities = () => useQuery({ queryKey: ['opportunities'], queryFn: matching.getOpportunities });
export const useAnalyseInquiry = () => useMutation({ mutationFn: (text: string) => matching.analyseInquiry(text) });
export const useSimilarityNetwork = () => useQuery({ queryKey: ['similarity-network'], queryFn: matching.getSimilarityNetwork });
export const useProactiveRecommendations = () => useQuery({ queryKey: ['proactive-recommendations'], queryFn: matching.getProactiveRecommendations });
