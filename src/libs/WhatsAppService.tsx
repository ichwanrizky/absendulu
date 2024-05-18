const sendWhatsappMessage = async (phoneNumber: string, message: string) => {
  try {
    const body = new FormData();
    body.append("target", phoneNumber);
    body.append("message", message);
    body.append("delay", "5");

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: `B6qW!M1+3Dk+uF-M+FHD`,
      },
      body,
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return error;
  }
};

export default sendWhatsappMessage;
