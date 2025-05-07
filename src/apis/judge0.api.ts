import axios from 'axios'

const rapidAPIKey = import.meta.env.VITE_RAPIDAPI_KEY

export const submitCode = async (code: string, languageId: number, testCases: string, expectedOutput: string) => {
  const response = await axios.post(
    // 'https://judge0-ce.p.rapidapi.com/submissions',
    'http://localhost:2358/submissions',
    {
      source_code: code,
      language_id: languageId,
      // stdin: testCases,
      // expected_output: expectedOutput,
      cpu_time_limit: '2',
      memory_limit: '128000'
    },
    {
      headers: {
        'Content-Type': 'application/json'
        // 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        // 'X-RapidAPI-Key': rapidAPIKey
      }
    }
  )

  return response
}

export const getResults = async (token: string) => {
  // const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
  const resultResponse = await axios.get(`http://localhost:2358/submissions/${token}`, {
    headers: {
      // 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      // 'X-RapidAPI-Key': rapidAPIKey
    }
  })

  return resultResponse.data
}
