export const getElectionStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return { status: "upcoming", isActive: false };
    if (now >= new Date(start) && now <= new Date(end)) return { status: "ongoing", isActive: true };
    return { status: "ended", isActive: false };
};
