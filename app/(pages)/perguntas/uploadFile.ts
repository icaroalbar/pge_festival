import axios from "axios";

export const uploadFile = async (file, user, question) => {
  const formData = new FormData();
  formData.append("user", user);
  formData.append("question", question);

  if (file) {
    formData.append("files", file);
  }

  try {
    await axios.post(
      "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/upload-question",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao enviar o arquivo:", error);
  }
};
