import prisma from '@/lib/prisma';

interface CreateNotificationParams {
    userId: number;
    type: 'application' | 'message' | 'system' | 'match';
    title: string;
    message: string;
    link?: string;
    applicationId?: number;
    postId?: number;
    chatRoomId?: number;
}

/**
 * สร้างการแจ้งเตือนใหม่
 */
export async function createNotification(params: CreateNotificationParams) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId: params.userId,
                type: params.type,
                title: params.title,
                message: params.message,
                link: params.link,
                applicationId: params.applicationId,
                postId: params.postId,
                chatRoomId: params.chatRoomId,
            }
        });

        return { success: true, notification };
    } catch (error) {
        console.error('Error creating notification:', error);
        return { success: false, error };
    }
}

/**
 * แจ้งเตือนเมื่อใบสมัครได้รับการตอบรับ
 */
export async function notifyApplicationAccepted(
    seekerId: number,
    applicationId: number,
    postId: number,
    shopName: string,
    jobName: string
) {
    return createNotification({
        userId: seekerId,
        type: 'application',
        title: 'ใบสมัครของคุณได้รับการตอบรับ! 🎉',
        message: `ร้าน "${shopName}" ได้ยอมรับใบสมัครของคุณสำหรับตำแหน่ง "${jobName}"`,
        link: `/job-seeker/applications/${applicationId}`,
        applicationId,
        postId
    });
}

/**
 * แจ้งเตือนเมื่อใบสมัครถูกปฏิเสธ
 */
export async function notifyApplicationRejected(
    seekerId: number,
    applicationId: number,
    postId: number,
    shopName: string,
    jobName: string
) {
    return createNotification({
        userId: seekerId,
        type: 'application',
        title: 'ใบสมัครถูกปฏิเสธ',
        message: `ร้าน "${shopName}" ขออภัยไม่สามารถรับสมัครคุณสำหรับตำแหน่ง "${jobName}" ได้ในตอนนี้`,
        link: `/job-seeker/applications/${applicationId}`,
        applicationId,
        postId
    });
}

/**
 * แจ้งเตือนเมื่อมีข้อความใหม่
 */
export async function notifyNewMessage(
    recipientUserId: number,
    senderName: string,
    chatRoomId: number,
    messagePreview: string
) {
    return createNotification({
        userId: recipientUserId,
        type: 'message',
        title: 'ข้อความใหม่ 💬',
        message: `${senderName}: ${messagePreview.substring(0, 100)}${messagePreview.length > 100 ? '...' : ''}`,
        link: `/job-seeker/chat/${chatRoomId}`,
        chatRoomId
    });
}

/**
 * แจ้งเตือนเมื่อพบงานที่เหมาะสม
 */
export async function notifyNewMatches(
    seekerId: number,
    matchCount: number,
    topJobName?: string
) {
    return createNotification({
        userId: seekerId,
        type: 'match',
        title: 'พบงานที่เหมาะกับคุณ! ✨',
        message: matchCount === 1
            ? `มีงาน Part-time "${topJobName}" ที่ตรงกับโปรไฟล์ของคุณ`
            : `มีงาน Part-time ${matchCount} ตำแหน่งที่ตรงกับโปรไฟล์ของคุณ`,
        link: '/job-seeker/matching'
    });
}

/**
 * แจ้งเตือนเมื่อมีผู้สมัครงานใหม่ (สำหรับ Shop Owner)
 */
export async function notifyNewApplication(
    shopOwnerId: number,
    applicationId: number,
    postId: number,
    seekerName: string,
    jobName: string
) {
    return createNotification({
        userId: shopOwnerId,
        type: 'application',
        title: 'มีผู้สมัครงานใหม่! 👤',
        message: `${seekerName} สมัครงานตำแหน่ง "${jobName}"`,
        link: `/shop-owner/applications/${applicationId}`,
        applicationId,
        postId
    });
}

/**
 * แจ้งเตือนระบบ (อัพเดทโปรไฟล์, การเปลี่ยนแปลงต่างๆ)
 */
export async function notifySystemUpdate(
    userId: number,
    title: string,
    message: string,
    link?: string
) {
    return createNotification({
        userId,
        type: 'system',
        title,
        message,
        link
    });
}

/**
 * แจ้งเตือนเมื่อใบสมัครมีการเปลี่ยนสถานะ
 */
export async function notifyApplicationStatusChange(
    seekerId: number,
    applicationId: number,
    postId: number,
    status: string,
    shopName: string,
    jobName: string
) {
    const statusMessages: Record<string, { title: string; message: string }> = {
        'in_progress': {
            title: 'งานกำลังดำเนินการ 🚀',
            message: `งาน "${jobName}" ที่ร้าน "${shopName}" กำลังดำเนินการ`
        },
        'completed': {
            title: 'งานเสร็จสมบูรณ์! ✅',
            message: `คุณได้ทำงาน "${jobName}" ที่ร้าน "${shopName}" เสร็จสิ้นแล้ว`
        },
        'terminated': {
            title: 'งานถูกยกเลิก ❌',
            message: `งาน "${jobName}" ที่ร้าน "${shopName}" ถูกยกเลิก`
        }
    };

    const statusInfo = statusMessages[status];
    if (!statusInfo) return { success: false };

    return createNotification({
        userId: seekerId,
        type: 'application',
        title: statusInfo.title,
        message: statusInfo.message,
        link: `/job-seeker/applications/${applicationId}`,
        applicationId,
        postId
    });
}
