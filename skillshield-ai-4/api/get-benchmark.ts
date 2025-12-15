import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBenchmarkForProblem } from './sectorBenchmarks';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userProblem } = req.body;
    
    if (!userProblem || typeof userProblem !== 'string') {
      return res.status(400).json({ error: 'userProblem is required' });
    }

    const benchmark = getBenchmarkForProblem(userProblem);
    
    return res.status(200).json(benchmark);
  } catch (error: any) {
    console.error('Error in get-benchmark API:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

