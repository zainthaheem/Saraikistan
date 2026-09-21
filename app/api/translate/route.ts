export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { text, sourceLanguage, targetLanguage } = body

    if (!text || !text.trim()) {
      return Response.json(
        { error: 'Please enter some text to translate.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      return Response.json(
        { error: 'Hugging Face API key is not configured.' },
        { status: 500 }
      )
    }

    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}.

Preserve the meaning, names, cultural expressions, and tone as accurately as possible.

Text:
${text}

Translation:`

    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.2,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      return Response.json(
        {
          error: 'Translation service returned an error.',
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    const translation =
      data?.choices?.[0]?.message?.content?.trim() || ''

    if (!translation) {
      return Response.json(
        { error: 'No translation was returned.' },
        { status: 500 }
      )
    }

    return Response.json({ translation })
  } catch (error) {
    console.error('Translation error:', error)

    return Response.json(
      { error: 'Unable to translate at this time.' },
      { status: 500 }
    )
  }
}
