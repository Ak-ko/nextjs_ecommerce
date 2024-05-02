export const wait = async (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration));
