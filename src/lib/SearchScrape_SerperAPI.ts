export default async function searchWithSerper(query: string) {
    try {
      const res = await fetch('/api/serap/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
        }
        console.log('🔍 Search results:', data);
    
    // ❌ Throw error if "shopping" is completely missing
    if (!('shopping' in data)) {
        throw new Error('No shopping results returned from Serper');
      }
  
      console.log('🔍 Search results:', data);
      return data.shopping;
    } catch (err) {
      console.error('❌ Serper API call failed:', err);
      return null;
    }
  }