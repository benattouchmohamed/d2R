export interface RobloxUser {
  username: string;
  displayName: string;
  id: string;
  avatarUrl: string;
}

export async function fetchRobloxUser(username: string): Promise<RobloxUser | { multiple: true; users: RobloxUser[] } | null> {
  try {
    const response = await fetch(
      `https://corsproxy.io/?https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}`
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      // If 4 or more users found, return all as suggestions
      if (data.data.length >= 4) {
        const users = await Promise.all(
          data.data.map(async (user: any) => {
            try {
              const avatarResponse = await fetch(
                `https://corsproxy.io/?https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png`
              );
              const avatarData = await avatarResponse.json();

              const avatarUrl =
                avatarData.data && avatarData.data.length > 0
                  ? avatarData.data[0].imageUrl
                  : "";

              return {
                username: user.name,
                displayName: user.displayName || user.name,
                id: user.id.toString(),
                avatarUrl,
              };
            } catch {
              return {
                username: user.name,
                displayName: user.displayName || user.name,
                id: user.id.toString(),
                avatarUrl: "",
              };
            }
          })
        );

        return { multiple: true, users };
      }

      // Single or few users - return the first one
      const user = data.data[0];

      const avatarResponse = await fetch(
        `https://corsproxy.io/?https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png`
      );
      const avatarData = await avatarResponse.json();

      const avatarUrl =
        avatarData.data && avatarData.data.length > 0
          ? avatarData.data[0].imageUrl
          : "";

      return {
        username: user.name,
        displayName: user.displayName || user.name,
        id: user.id.toString(),
        avatarUrl,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching Roblox user:", error);
    return null;
  }
}
