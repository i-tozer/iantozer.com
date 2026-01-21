I’ve developed a security review workflow that has been very effective for me.

In my last two audits, my results were at least comparable to those of well-known firms. In one engagement, I identified two high-severity and two medium-severity issues. The previous big-brand audit did not identify any high-severity vulnerabilities.

Whether this difference comes from my approach, random variance, or something else, I won’t speculate. My goal is to share a workflow that might help or inspire researchers, and to share with folks who may be interested in working with me.

**TL;DR**: I use IDE screenshots, Excalidraw, and LLMs.

## **Visual-first workflow with Excalidraw**

I use Excalidraw as a plugin inside Obsidian. This gives me:

- unlimited whiteboards
    
- markdown notes per project
    
- a central workspace with all code snippets, diagrams, and reasoning
    

I almost always start by trying to understand the architecture from the entry points.

I create a visual architectural map and continually refine it as I go.

In the map, I try to capture:

- entry points
    
- protocol users
    
- contract-to-contract interactions
    
- integrations
    
- an overall flavour of what the protocol does and how it’s designed.
    

Here’s what one of my maps looks like:

**Architectural Map**
:::excalidraw https://link.excalidraw.com/readonly/Qw6Y2tLPhtQAptqGDSTk

This step is time-consuming, but I think LLM-based tools will reduce the initial workload with a little innovation and engineering.

## **Deep-dive execution path tracing**

Once I understand the high-level structure, I pick an entry point and follow every execution path.

I take IDE screenshots, drop them into Excalidraw, and annotate them like a 1970s NYC homicide detective working midnights in a smoky basement — except I use light mode, because you can’t catch roaches in the dark.

Screenshots help me:

- bring in any code I want
    
- link it visually
    
- annotate freely
    
- zoom in/out without context switching
    
- avoid the urge to click through and destroy focus
    

It’s also enjoyable and fun (at least to me).

To see what this looks like in practice (click links to explore!):

**Investigation 1**
:::excalidraw https://link.excalidraw.com/readonly/YEEDuljowOddcER8zcMC

**Investigation 2**
:::excalidraw https://link.excalidraw.com/readonly/DHYDsuV4DAOc0dBPJXwt

**Investigation 3**
:::excalidraw https://link.excalidraw.com/readonly/1HJNbsZVM85CCR4u28m7

Just by exploring boundary conditions and understanding how things work, I start to develop hunches (hypotheses) that may or may not lead to actual vulnerabilities.

My false positive rate is still pretty high, especially when I don’t fully understand the codebase. However, false positives often lead to insights about the underlying system. Once you desensitize to the thrill of thinking you’ve hit a jackpot, you stop mourning them and start treating them as useful nuggets of intel.

## **LLMs**

I’m sold on LLMs for security research and use them to assist with nearly every aspect of the work (Q&A, validation, PoCs, hypothesis refinement).

I occasionally like to gaslight LLMs with trivial long-shot prompts such as: “There’s a vulnerability here, can you find it? … No, not that one!”

I also experiment with open-source agent workflows. One I’ve been especially impressed by is Hound (developed by Bernhard Mueller), which I discovered while scrolling X.

Hound works by splitting the in-scope code into chunks, building aspect graphs that represent different dimensions of the codebase (selected by the LLM, with optional guidance) such as system architecture, call flows, and token flows, and then traversing those graphs with ongoing hypothesis generation and refinement. It mirrors how a human auditor reasons - but at scale.

I’ve run Hound for 80+ hours on a codebase and found its results useful. It produces false leads and duplicates, but those often point to unusual design patterns that are worth investigating anyway.

If you’d like to learn more, Bernhard explains it better:

- My top-level visual walkthrough: [https://link.excalidraw.com/readonly/9XNrBO0WfoD3WYwI0z8e](https://link.excalidraw.com/readonly/9XNrBO0WfoD3WYwI0z8e)
    
- Bernhard’s blog: [https://muellerberndt.medium.com/unleashing-the-hound-how-ai-agents-find-deep-logic-bugs-in-any-codebase-64c2110e3a6f](https://muellerberndt.medium.com/unleashing-the-hound-how-ai-agents-find-deep-logic-bugs-in-any-codebase-64c2110e3a6f)
    
- Bernhard’s academic paper: [https://arxiv.org/pdf/2510.09633](https://arxiv.org/pdf/2510.09633)
    

## **LLM auditing fleets**

The design space for LLM-based auditing fleets is massive. The benefits for development teams are obvious: you can integrate meaningful security audits into your development pipeline from day 1 at a fraction of the current cost.

I expect this to drive gradual but meaningful structural changes in the industry: increased in-housing and QA-ification of security researchers, the growth of LLM benchmarking dashboards, and fierce competition to develop the agentic workflow that rules them all.

## **Summary of my workflow**

To audit, I:

1. Build a top-level architectural map and refine it continuously.
    
2. Investigate depth-first via user entry points.
    
3. Take loads of screenshots, drag them into Excalidraw, and annotate, annotate, annotate.
    
4. Generate hypotheses in real time (most of which are quickly invalidated).
    
5. Use LLMs continually across almost every aspect of the work (Q&A, validation, PoCs, hypothesis refinement).
    

If you’re interested in someone who can help with QA, run LLM auditing fleets, validate and refine hypotheses, or perform manual deep-dive code reviews, feel free to reach out. I’m happy to collaborate.
