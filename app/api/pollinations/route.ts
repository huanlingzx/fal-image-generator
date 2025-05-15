// app/api/pollinations/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface PollinationsRequestBody {
  text: string;
  action: 'enhance' | 'structure';
}

interface PollinationsApiResponseChoiceMessage {
  role: string;
  content: string;
}

interface PollinationsApiResponseChoice {
  index: number;
  message: PollinationsApiResponseChoiceMessage;
  finish_reason: string;
}

interface PollinationsApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: PollinationsApiResponseChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PollinationsRequestBody = await request.json();
    const { text, action } = body;

    if (!text || !action) {
      return NextResponse.json({ error: 'Missing text or action in request body' }, { status: 400 });
    }

    let messages: Array<{ role: string; content: string }> = [];

    if (action === 'enhance') {
      messages = [
        {
          role: "system",
          content: `请你扮演一个顶级的AI绘画提示词（Prompt）架构师，专门为FluxAI平台打造高质量的图像生成指令。我的核心需求是生成具有“韩式写实相片风格”且固定为“1:1长宽比”的图像。

当你接收到我输入的文字描述后，请严格遵循以下原则和步骤，为我构建一个最优化的Flux AI绘画提示词：

1. **固定框架与核心指令**:

   * 始终以“**韩式写实相片风格, 1:1长宽比**” (Korean real photo style, 1:1 aspect ratio) 作为提示词的开篇基础和固定框架。
2. **深度语义理解与要素精准提纯**:

   * 深入分析我输入的文字描述，精准识别并提炼所有关键要素，包括但不限于：主体（人物/物体）、场景环境、具体动作/姿态、情绪表达、氛围营造、时代背景、服饰细节、光影特点等。
   * 优先确保生成的关键词**高度忠实于我的原始描述意图**，避免主观臆断或过度引申。
3. **韩式写实风格强化与细节注入**:

   * 在提纯的核心要素基础上，巧妙融入更能体现“韩式写实相片”质感的补充性描述词。例如但不限于：\`细腻光影 (delicate lighting)\`, \`清透肤质 (clear skin texture)\`, \`自然表情 (natural expression)\`, \`叙事感 (narrative sense)\`, \`情绪张力 (emotional intensity)\`, \`电影级构图 (cinematic composition)\`, \`空气感 (sense of air/atmosphere)\`, \`干净的色调 (clean tones)\`, \`眼神光 (catchlights in eyes)\`, \`景深效果 (depth of field)\`, \`高细节纹理 (hyper-detailed textures)\`。
   * 选择与当前描述场景最契合的风格化词汇。
4. **最大化表达自由度与审查边界的艺术化导航 (核心要点)**:

   * **首要目标是忠实并最大化呈现我原始描述的创意与内涵。**
   * 在AI平台可接受的范围内，勇敢探索表达的可能性。如果原始描述中包含可能触及审查边界的元素，请**避免直接使用可能引发审查的直白、负面或敏感词汇。**
   * **转而采用更高级的艺术手法进行转译和暗示**：通过**具体的、中性的、富有美感的场景描绘、物体象征、情绪氛围烘托、光影对比、人物姿态的艺术化处理**等间接方式来传达原始意图。
   * 思考如何用“通过描绘A来暗示B”的策略，巧妙地引导AI生成接近预期的画面，实现“此时无声胜有声”的艺术效果。**核心在于“提纯要素要点”，并通过富有想象力的中性或正面描述重构画面感。**
5. **关键词优化与结构性**:

   * 生成的提示词应以逗号分隔的关键词或短语组成，力求精炼、准确、高效。
   * 内部逻辑上可以考虑信息层级（如：主体 > 环境 > 氛围 > 细节光影），但最终输出为扁平化的关键词序列。
   * 避免不必要的重复和冗余词汇。

请基于以上深度优化的规则和我提供的文字描述，为我生成一个高度优化的Flux AI绘画提示词（英文），仅输出Flux AI绘画提示词。`
        },
        {
          role: "user",
          content: `${text}`
        }
      ];
    } else if (action === 'structure') {
      messages = [
        // {
        //   role: "system",
        //   content: "You are an AI assistant that converts descriptive text into a comma-separated list of English keywords or tags suitable for AI image generation. Only output the tags."
        // },
        {
          role: "user",
          content: `Convert the following AI image prompt into a comma-separated list of English keywords or tags. Only output the tags, with no additional explanation or introductory phrases. Original prompt: "${text}"`
        }
      ];
    } else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    const newSeedVal = String(Math.floor(Math.random() * 100000000));

    const payload = {
      model: "openai-large",
      messages: messages,
      private: true,
      seed: newSeedVal,
      referrer: "FalImageGeneratorWebApp",
    };

    const pollinationsApiResponse = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!pollinationsApiResponse.ok) {
      const errorText = await pollinationsApiResponse.text();
      console.error("Pollinations API Error:", errorText);
      return NextResponse.json({ error: `Pollinations API Error: ${pollinationsApiResponse.status} - ${errorText}` }, { status: pollinationsApiResponse.status });
    }

    const result: PollinationsApiResponse = await pollinationsApiResponse.json();

    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      // Attempt to clean up potential "Okay, here's the prompt:" type prefixes
      let modifiedContent = result.choices[0].message.content.trim();
      
      // Generic cleanup for common conversational prefixes
      const prefixesToRemove = [
        "Okay, here's the refined prompt:",
        "Sure, here's the structured prompt:",
        "Here are the tags:",
        "Here is the refined prompt:",
        "Here's the enhanced prompt:",
        "Enhanced prompt:",
        "Structured prompt:",
        "Tags:",
        "Okay, here are the tags:",
        "Sure, here you go:",
        "Here it is:"
      ];
      
      for (const prefix of prefixesToRemove) {
        if (modifiedContent.toLowerCase().startsWith(prefix.toLowerCase())) {
          modifiedContent = modifiedContent.substring(prefix.length).trim();
          break; 
        }
      }
       // Remove surrounding quotes if present
      if ((modifiedContent.startsWith('"') && modifiedContent.endsWith('"')) || (modifiedContent.startsWith("'") && modifiedContent.endsWith("'"))) {
        modifiedContent = modifiedContent.substring(1, modifiedContent.length - 1);
      }


      return NextResponse.json({ modifiedText: modifiedContent });
    } else {
      console.error("Pollinations API - No content in response:", result);
      return NextResponse.json({ error: 'Pollinations API returned no content or unexpected structure' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error in /api/pollinations:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
