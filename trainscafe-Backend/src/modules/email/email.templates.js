export const verifyEmailTemplate = (name, verifyLink) => {
  return `
    <div style="font-family:Arial;padding:20px">
      <h2>Welcome to Trainscafe 🚆</h2>

      <p>Hello ${name},</p>

      <p>Please verify your email:</p>

      <a href="${verifyLink}" 
         style="display:inline-block;
         padding:12px 20px;
         background:#e63946;
         color:white;
         text-decoration:none;
         border-radius:6px;">
         Verify Email
      </a>

      <p>This link expires in 24 hours.</p>

      <p>– Team TrainsCafe</p>
    </div>
  `;
};