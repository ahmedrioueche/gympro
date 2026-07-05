import { ActoChatWidget, ActocoreProvider } from "@ahmedrioueche/actocore-sdk";
import "@ahmedrioueche/actocore-sdk/styles.css";
import { gymApi } from "@ahmedrioueche/gympro-client";
import { BASE_MODAL_Z_INDEX } from "../../../hooks/useModalLayer";

function ActoCore() {
  return (
    <ActocoreProvider
      apiKey={import.meta.env.VITE_ACTOCORE_API_KEY}
      baseURL={import.meta.env.VITE_ACTOCORE_API_URL}
      loadRemoteConfig // picks up Studio SDK config (colors, fonts, etc.)
      actions={{
        create_gym: async (input: { name: string }) => {
          gymApi.create({ name: input.name, owner: "current_user_id" });
        },
        delete_gym: async (input: { id: string }) => {
          gymApi.remove(input.id);
        },
      }}
    >
      <ActoChatWidget zIndex={BASE_MODAL_Z_INDEX - 10} />
    </ActocoreProvider>
  );
}

export default ActoCore;
