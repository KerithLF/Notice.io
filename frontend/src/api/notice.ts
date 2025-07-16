export async function generateNotice(formData: FormData) {
  const res = await fetch("http://localhost:8000/generate-notice/", {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getTemplates() {
  const res = await fetch("http://localhost:8000/templates/");
  return res.json();
}

export async function getLitigationFields(templateName: string) {
  const res = await fetch(`http://localhost:8000/litigation-fields/${templateName}`);
  return res.json();
}

export async function getIpcRecommendations(subject: string) {
  const res = await fetch(`http://localhost:8000/ipc-recommendations?subject=${encodeURIComponent(subject)}`);
  return res.json();
}