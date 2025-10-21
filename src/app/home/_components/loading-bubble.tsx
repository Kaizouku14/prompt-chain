const LoadingBubble = () => {
  return (
    <div className="flex h-60 items-start justify-end gap-3">
      <div className="bg-primary/10 text-foreground rounded-2xl px-3 py-2 text-sm shadow-inner">
        <div className="flex h-6 items-center gap-1">
          <span
            className="bg-foreground inline-block h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="bg-foreground inline-block h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="bg-foreground inline-block h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      </div>
      <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-bold">
        AI
      </div>
    </div>
  );
};

export default LoadingBubble;
