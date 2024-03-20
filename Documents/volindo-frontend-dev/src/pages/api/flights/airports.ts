import type { NextApiRequest, NextApiResponse } from 'next';
import {
  searchAirportByWord,
  searchAirportByCode,
} from '@utils/airportsSearchers';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search, code } = req.query;

  if (!search && !code) return res.status(200).json([]);

  const wordToSearch = search as string;
  const codeToSearch = code as string;

  const airports = wordToSearch
    ? searchAirportByWord(wordToSearch.trim())
    : searchAirportByCode(codeToSearch.trim());

  res.setHeader('Cache-Control', 'public, max-age=28800');

  return res.status(200).json(airports);
}
