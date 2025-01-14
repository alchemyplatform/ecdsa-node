// src/scripts/utils/console.ts
export const ConsoleUtils = {
    // Simple logging
    log: (...args: any[]) => console.log(...args),
    
    // Basic section formatting
    printSection: (title: string) => 
      console.log(`\n=== ${title} ===`),
    
    printDivider: () => 
      console.log('----------------------------------------'),
    
    // Simple loading animation
    async loading(text: string, duration: number = 1000) {
      const dots = ['.', '..', '...'];
      const startTime = Date.now();
      
      while (Date.now() - startTime < duration) {
        for (const dot of dots) {
          process.stdout.write(`\r${text}${dot}`);
          await new Promise(r => setTimeout(r, 200));
        }
      }
      process.stdout.write('\n');
    }
  };