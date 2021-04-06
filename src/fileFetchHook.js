import { useState, useEffect } from 'react';
import Papa from 'papaparse'

export function useFetchFile(source) {
    const [rows, setRows] = useState([])

  useEffect(async () => {
    const response = await fetch(source);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    const results = Papa.parse(csv, { header: true });
    const rows = results.data;
    setRows(rows);
  }, []);

  return rows;
}