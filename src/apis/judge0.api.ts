import axios from 'axios'

export const runCode = async (code: string, languageId: number, stdin: string, expected_output: string) => {
  // const response = await axios.post('http://localhost:2358/submissions?base64_encoded=false&wait=true', {
  // const response = await axios.post('http://14.225.207.77:2358/submissions?base64_encoded=false&wait=true', {
  const response = await axios.post('https://eurekas-judge0.io.vn/submissions?base64_encoded=false&wait=true', {
    language_id: languageId,
    source_code: code,
    stdin,
    expected_output
  })

  return response
}
