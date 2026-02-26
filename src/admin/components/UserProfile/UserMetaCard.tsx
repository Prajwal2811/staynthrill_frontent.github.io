import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            {/* User Image (click to edit) */}
            <div
              className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full cursor-pointer dark:border-gray-800"
              onClick={openModal}
            >
              <img src="/images/user/owner.jpg" alt="user" />
            </div>

            <div className="order-3 xl:order-2 text-center xl:text-left">
              <h4
                className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 cursor-pointer"
                onClick={openModal}
              >
                Prajwal Ingole
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Software Developer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-5 mt-6"
          >
            <div>
              <Label>First Name</Label>
              <Input type="text" defaultValue="Prajwal" />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input type="text" defaultValue="Ingole" />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" defaultValue="randomuser@pimjo.com" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
