export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpCooldownRemaining = (lastSentAt, cooldownSeconds = 30) => {
  if (!lastSentAt) return 0;
  const elapsed = (Date.now() - new Date(lastSentAt).getTime()) / 1000;
  return Math.max(0, cooldownSeconds - elapsed);
};

