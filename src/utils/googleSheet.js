export const submitToGoogleSheet = async (data) => {
  const url = import.meta.env.VITE_GOOGLE_SHEET_URL;
  const key = import.meta.env.VITE_GOOGLE_SHEET_KEY; 
  if (!url) {
    console.error("Google Sheet URL is missing in .env");
    return { error: "Configuration missing" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...data, auth_key: key}),
    });

    return { success: true };
  } catch (error) {
    console.error("Google Sheet error:", error);
    return { error: error.message };
  }
};
