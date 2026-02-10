import { useMutation, useQuery } from '@tanstack/react-query';
import { impact } from '../services/api';

export const useJobCreation = () => useMutation({ mutationFn: impact.calculateJobCreation });
export const useGDPContribution = () => useMutation({ mutationFn: impact.calculateGDPContribution });
export const useMonteCarlo = () => useMutation({ mutationFn: impact.runMonteCarlo });
export const useROITimeline = () => useMutation({ mutationFn: impact.generateROITimeline });
export const useComprehensiveReport = () => useMutation({ mutationFn: impact.getComprehensiveReport });
export const useSectorBenchmarks = () => useQuery({ queryKey: ['sector-benchmarks'], queryFn: impact.getSectorBenchmarks });
