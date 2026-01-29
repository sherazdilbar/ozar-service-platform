import { PrismaService } from '../prisma/prisma.service';
export declare class CertificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCertifications(proId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        proId: string;
        issueDate: Date;
        issuingOrg: string;
        expiryDate: Date | null;
        certificateUrl: string | null;
        status: import(".prisma/client").$Enums.CertificationStatus;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }[]>;
    addCertification(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        proId: string;
        issueDate: Date;
        issuingOrg: string;
        expiryDate: Date | null;
        certificateUrl: string | null;
        status: import(".prisma/client").$Enums.CertificationStatus;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }>;
    updateCertification(proId: string, certId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        proId: string;
        issueDate: Date;
        issuingOrg: string;
        expiryDate: Date | null;
        certificateUrl: string | null;
        status: import(".prisma/client").$Enums.CertificationStatus;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }>;
    deleteCertification(proId: string, certId: string): Promise<{
        success: boolean;
    }>;
    getBadges(proId: string): Promise<{
        id: string;
        name: string;
        description: string;
        proId: string;
        earnedAt: Date;
        badgeType: string;
        icon: string;
    }[]>;
    awardBadge(proId: string, badgeType: string): Promise<{
        id: string;
        name: string;
        description: string;
        proId: string;
        earnedAt: Date;
        badgeType: string;
        icon: string;
    }>;
    private getBadgeConfig;
}
