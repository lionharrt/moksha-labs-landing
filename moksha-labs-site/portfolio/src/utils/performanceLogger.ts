/**
 * Performance logging utilities to track React renders and DOM mutations
 */

interface PerformanceLog {
  component: string;
  timestamp: number;
  type: "render" | "mutation" | "effect";
  details?: Record<string, any>;
}

class PerformanceLogger {
  private logs: PerformanceLog[] = [];
  private enabled: boolean = false;
  private mutationObserver: MutationObserver | null = null;
  private renderCounts: Map<string, number> = new Map();
  private mutationCounts: Map<string, number> = new Map();

  enable() {
    this.enabled = true;
    this.startMutationTracking();
  }

  disable() {
    this.enabled = false;
    this.stopMutationTracking();
  }

  private startMutationTracking() {
    if (typeof window === "undefined") return;

    this.mutationObserver = new MutationObserver((mutations) => {
      if (!this.enabled) return;

      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement;
        let componentName = target.getAttribute("data-component");

        // If no data-component, try to identify by other attributes
        if (!componentName) {
          const id = target.id;
          const className = target.className;
          const parent = target.parentElement;
          const parentComponent = parent?.getAttribute("data-component");

          // Create a more descriptive name
          if (id) {
            componentName = `unknown-${id}`;
          } else if (className && typeof className === "string") {
            const firstClass = className.split(" ")[0];
            componentName = `unknown-${target.tagName.toLowerCase()}.${firstClass}`;
          } else if (parentComponent) {
            componentName = `unknown-child-of-${parentComponent}`;
          } else {
            componentName = `unknown-${target.tagName.toLowerCase()}`;
          }
        }

        const count = this.mutationCounts.get(componentName) || 0;
        this.mutationCounts.set(componentName, count + 1);

        this.log({
          component: componentName,
          timestamp: performance.now(),
          type: "mutation",
          details: {
            type: mutation.type,
            attributeName: mutation.attributeName,
            target: target.tagName,
            id: target.id,
            className:
              typeof target.className === "string" ? target.className : "",
            parentComponent:
              target.parentElement?.getAttribute("data-component") || null,
          },
        });
      });
    });

    this.mutationObserver.observe(document.body, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    });
  }

  private stopMutationTracking() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  logRender(componentName: string, props?: Record<string, any>) {
    if (!this.enabled) return;

    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);

    this.log({
      component: componentName,
      timestamp: performance.now(),
      type: "render",
      details: props,
    });
  }

  logEffect(
    componentName: string,
    effectName: string,
    details?: Record<string, any>
  ) {
    if (!this.enabled) return;

    this.log({
      component: componentName,
      timestamp: performance.now(),
      type: "effect",
      details: { effectName, ...details },
    });
  }

  private log(log: PerformanceLog) {
    this.logs.push(log);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  getStats() {
    const now = performance.now();
    const recentLogs = this.logs.filter((log) => now - log.timestamp < 1000); // Last second

    const renderStats = Array.from(this.renderCounts.entries()).map(
      ([name, count]) => ({
        component: name,
        renders: count,
      })
    );

    const mutationStats = Array.from(this.mutationCounts.entries()).map(
      ([name, count]) => ({
        component: name,
        mutations: count,
      })
    );

    const recentRenders = recentLogs.filter(
      (log) => log.type === "render"
    ).length;
    const recentMutations = recentLogs.filter(
      (log) => log.type === "mutation"
    ).length;

    return {
      renderStats: renderStats.sort((a, b) => b.renders - a.renders),
      mutationStats: mutationStats.sort((a, b) => b.mutations - a.mutations),
      recentRenders,
      recentMutations,
      recentLogs: recentLogs.slice(-50), // Last 50 logs
    };
  }

  printStats() {
    const stats = this.getStats();
    console.group("🔍 Performance Stats (Last Second)");
    console.log("Recent Renders:", stats.recentRenders);
    console.log("Recent Mutations:", stats.recentMutations);
    console.group("Top Rendering Components");
    stats.renderStats.slice(0, 10).forEach((stat) => {
      console.log(`${stat.component}: ${stat.renders} renders`);
    });
    console.groupEnd();
    console.group("Top Mutating Components");
    stats.mutationStats.slice(0, 10).forEach((stat) => {
      console.log(`${stat.component}: ${stat.mutations} mutations`);
    });
    console.groupEnd();

    // Show details about unknown mutations
    const unknownMutations = stats.recentLogs
      .filter(
        (log) => log.type === "mutation" && log.component.startsWith("unknown")
      )
      .slice(0, 5);
    if (unknownMutations.length > 0) {
      console.group("🔍 Unknown Mutation Details (Sample)");
      unknownMutations.forEach((log) => {
        console.log(log.component, log.details);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  clear() {
    this.logs = [];
    this.renderCounts.clear();
    this.mutationCounts.clear();
  }
}

export const performanceLogger = new PerformanceLogger();

// Enable in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Enable logging
  performanceLogger.enable();

  // Print stats every 2 seconds
  // setInterval(() => {
  //   performanceLogger.printStats();
  // }, 2000);

  // Expose to window for manual inspection
  (window as any).performanceLogger = performanceLogger;
}
