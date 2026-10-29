import { AIMode, ChatMessage } from '../types';
import { getDemoResponse } from '../data/aiKnowledgeBase';
import { storageService } from './storageService';

export interface AIServiceResponse {
  content: string;
  isDemo: boolean;
  error?: string;
}

export const aiService = {
  isConfigured(): boolean {
    const profile = storageService.getProfile();
    return !!profile.apiKey && profile.apiKey.trim().length > 5;
  },

  async askTutor(userQuery: string, mode: AIMode = 'beginner', history: ChatMessage[] = []): Promise<AIServiceResponse> {
    const profile = storageService.getProfile();
    const apiKey = profile.apiKey?.trim();

    // If no custom API key is configured, return rich educational demo response
    if (!apiKey) {
      // Simulate realistic AI generation latency (600ms)
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        content: getDemoResponse(userQuery, mode),
        isDemo: true
      };
    }

    // If an API key is provided, attempt call to OpenAI/compatible endpoint
    try {
      const systemPrompt = `You are an expert Electronics and Telecommunication Engineering (ENTC) professor and interactive lab tutor.
Current Mode: ${mode.toUpperCase()}
- Mode "BEGINNER": Use intuitive real-world analogies (water pipes, doors, ramps), simple diagrams, and avoid impenetrable jargon.
- Mode "STEPBYSTEP": Break down calculations, mathematical proofs, circuit diagrams, and theorems systematically into numbered steps.
- Mode "TROUBLESHOOT": Focus on real-world hardware debugging, parasitic noise, impedance mismatch, grounding loops, thermal effects, and firmware gotchas.
- Mode "CODING": Provide clean, well-commented C/C++ (Arduino/ESP32) or Verilog/Python code with explanations of hardware registers.

Answer the student's ENTC inquiry thoroughly with Markdown, formulas, and code blocks where helpful.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-4).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userQuery }
          ],
          temperature: 0.7,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `API error with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated.';

      return {
        content,
        isDemo: false
      };
    } catch (err: any) {
      // Fallback gracefully to demo mode on network or authentication error
      return {
        content: `⚠️ **Custom API Connection Notice**: ${err?.message || 'Failed to connect to the external API'}.\n\n` +
          `Falling back to ENTC Knowledge Base mode below:\n\n` +
          getDemoResponse(userQuery, mode),
        isDemo: true,
        error: err?.message
      };
    }
  }
};
