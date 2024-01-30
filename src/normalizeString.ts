export function normalizeString(input: string): string {
  const diacriticMap: Record<string, string> = {
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    'ó': 'o',
    'ś': 's',
    'ż': 'z',
    'ź': 'z'
  };

  return input
    .replace(/[ąćęłńóśżź]/g, match => diacriticMap[match] || match)
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^\w\s]/g, '')          
    .replace(/\s+/g, '_');
}