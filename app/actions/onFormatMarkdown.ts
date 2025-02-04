interface TreeNode {
  children: TreeNode[];
  level: number;
  text?: string;
  isChecked: boolean;
  hasCheckbox: boolean;
}

export function onFormatMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  
  function createTree(lines: string[]): TreeNode {
    const root: TreeNode = { children: [], level: -1, isChecked: false, hasCheckbox: false };
    const stack: TreeNode[] = [root];
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const level = (line.match(/^\s*/)?.[0]?.length ?? 0) / 4;
      
      const node: TreeNode = {
        text: line.trim(),
        children: [],
        level,
        isChecked: line.includes('[x]'),
        hasCheckbox: line.includes('[ ]') || line.includes('[x]')
      };
      
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });
    
    return root;
  }
  
  function processTree(node: TreeNode): boolean {
    if (!node.children.length) {
      return node.isChecked;
    }
    
    node.children = node.children.filter(child => {
      const keepChild = processTree(child);
      return keepChild;
    });
    
    return node.isChecked || node.children.length > 0;
  }
  
  function treeToMarkdown(node: TreeNode, indent = ''): string {
    let result = '';
    
    if (node.text && node.level >= 0) {
      const cleanText = node.text
        .replace(/\[[ x]\]\s*/, '') 
        .replace(/^-\s*/, '');  
      result += `${indent}- ${cleanText}\n`;
    }
    
    node.children.forEach(child => {
      result += treeToMarkdown(child, indent + '    ');
    });
    
    return result;
  }
  
  const tree = createTree(lines);
  processTree(tree);
  return treeToMarkdown(tree).trim();
}