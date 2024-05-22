export async function updateFile(file_path, jsonData) {
    try {
        const response = await fetch("/workspace/update_file", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                file_path: file_path,
                json_str: jsonData,
            }),
        });
        const result = await response.text();
        return result;
    } catch (error) {
        alert("Error saving workflow .json file: " + error);
        console.error("Error saving workspace:", error);
    }
}

