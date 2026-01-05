/**
 * Utility functions for job-seeker profile management
 */

export interface JobSeekerProfile {
    fullName?: string | null;
    phone?: string | null;
    address?: string | null;
    gender?: string | null;
    age?: number | null;
}

/**
 * Check if a job-seeker profile has all required fields filled
 * Required fields: fullName, phone, address
 */
export function isProfileComplete(profileData: { success?: boolean; data?: JobSeekerProfile } | null | undefined): boolean {
    if (!profileData) return false;
    if (!profileData.success) return false;

    const profile = profileData.data;
    if (!profile) return false;

    // ตรวจสอบฟิลด์ที่จำเป็น
    return !!(
        profile.fullName &&
        profile.phone &&
        profile.address
    );
}

/**
 * Shop profile interface
 */
export interface ShopProfile {
    shopName?: string | null;
    phone?: string | null;
    address?: string | null;
}

/**
 * Check if a shop profile has all required fields filled
 * Required fields: shopName, phone, address
 */
export function isShopProfileComplete(shopData: { success?: boolean; shop?: ShopProfile } | null | undefined): boolean {
    if (!shopData) return false;
    if (!shopData.success) return false;

    const shop = shopData.shop;
    if (!shop) return false;

    // ตรวจสอบฟิลด์ที่จำเป็น
    return !!(
        shop.shopName &&
        shop.phone &&
        shop.address
    );
}
