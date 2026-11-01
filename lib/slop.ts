// Humanizer layer. Patterns come from the humanizer skill (Wikipedia: Signs of AI writing).
// Applied to Straddle's own sentences only. The writer's words are never touched, even if they
// use an em dash or a stock phrase: that is their voice.

export type SlopHit = { rule: string; match: string };

const RULES: { rule: string; re: RegExp }[] = [
  { rule: "AI vocabulary", re: /\b(delve[sd]?|tapestry|testament|pivotal|crucial|vibrant|underscor(?:e|es|ed|ing)|showcas(?:e|es|ed|ing)|intricate|intricacies|interplay|enduring|fostering|garner(?:s|ed)?|game[- ]?changer|seamless(?:ly)?|ever[- ]evolving|evolving landscape|realm of)\b/gi },
  { rule: "Inflated significance", re: /\b(plays? a (?:vital|crucial|key|pivotal|significant) role|a (?:vital|pivotal) moment|turning point|indelible mark|deeply rooted)\b/gi },
  { rule: "Avoids is/are", re: /\b(serves as|stands as|boasts|marks a (?:shift|turning)|represents a)\b/gi },
  { rule: "Not X but Y", re: /\b(?:is|are|isn'?t|aren'?t|was|wasn'?t)(?: not|n'?t)? (?:just|only|merely|simply)\b|\bnot (?:just|only|merely|simply)\b[^.?!]{0,80}\b(?:but|it'?s|it is)\b/gi },
  { rule: "Announces the point", re: /\b(let'?s (?:dive|explore|break|unpack)[a-z ]*|here'?s (?:what|why|the thing)|the thing is|let'?s be honest|real talk|without further ado|it'?s (?:important|worth) (?:to note|noting)[a-z ]*|it is important to note)\b/gi },
  { rule: "Fake depth", re: /\b(the real question is|at its core|what really matters|the deeper issue|the heart of the matter)\b/gi },
  { rule: "Answers a doubt nobody raised", re: /\b(to be clear|don'?t get me wrong|i'?m not (?:saying|arguing)|this is not to say)\b/gi },
  { rule: "Filler", re: /\b(in order to|due to the fact that|at this point in time|has the ability to|in the event that)\b/gi },
  { rule: "Generic ending", re: /\b(the future (?:looks|is) bright|exciting times|only time will tell)\b/gi },
  { rule: "Stock opener", re: /\bin today'?s (?:fast[- ]paced|digital|ever[- ]changing)\b/gi },
  { rule: "Stacked hedges", re: /\b(?:could|might|may) (?:potentially|possibly|arguably)\b/gi },
  { rule: "Emoji", re: /[\uD83C-\uD83E][\uDC00-\uDFFF]|[☀-➿]/g },
  { rule: "Bold markdown", re: /\*\*[^*]+\*\*/g },
];

export function scanSlop(text: string): SlopHit[] {
  const seen = new Set<string>();
  const hits: SlopHit[] = [];
  for (const { rule, re } of RULES) {
    for (const m of Array.from(text.matchAll(re))) {
      const key = rule + m[0].toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ rule, match: m[0].trim() });
    }
  }
  return hits;
}

// Em and en dashes become commas. Digit ranges such as 2024–25 are left alone.
export function removeDashes(text: string): string {
  return text
    .replace(/ (?:[—–]|--) /g, ", ")
    .replace(/([A-Za-z”"')])[—–]([A-Za-z“"'(])/g, "$1, $2");
}
