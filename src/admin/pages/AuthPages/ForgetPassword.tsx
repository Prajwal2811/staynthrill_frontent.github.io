import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgetPassword from "../../components/auth/ForgetPassword";

export default function ForgetPasswordPage() {
  return (
    <>
      <PageMeta
        title="Forget Password - StayNThrill"
        description="Reset your password for StayNThrill dashboard."
      />
      <AuthLayout>
        <ForgetPassword />
      </AuthLayout>
    </>
  );
}
