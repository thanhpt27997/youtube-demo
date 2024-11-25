// app/sign-in/page.tsx

'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from './styles.module.scss'

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  if (session) {
    return null
  }
  return (
    <div className={styles.container}>
      <div className={styles.boxDetail}>
        <h1>Chào mừng đến với ứng dụng quản lý kênh Youtube.</h1>
        <p>
          Đây là phiên bản demo được dựng trên tiêu chí bài test của AnyMind Group.
        </p>
        <p>
          Các tính năng chính bao gồm:<br />
          - Đăng nhập, đăng xuất.<br />
          - Xem báo cáo hoạt động trên kênh (danh sách).<br />
          - Xóa bình luận, trả lời bình luận, liệt kê bình luận, chèn bình luận mới.
        </p>
        <span>***Vì là bản demo nên sẽ còn nhiều lỗi hoặc trải nghiệm người dùng chưa tốt, hi vọng sẽ nhận được góp ý từ Anymind Group.***</span>
        <button onClick={handleSignIn}>Đăng nhập với Google</button>
      </div>
    </div>
  );
};

export default SignIn;
