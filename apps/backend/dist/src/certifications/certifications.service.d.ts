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
        status: import(".prisma/client").$Enums.CertificationStatus;
        issuingOrg: string;
        issueDate: Date;
        expiryDate: Date | null;
        certificateUrl: string | null;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }[]>;
    addCertification(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        proId: string;
        status: import(".prisma/client").$Enums.CertificationStatus;
        issuingOrg: string;
        issueDate: Date;
        expiryDate: Date | null;
        certificateUrl: string | null;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }>;
    updateCertification(proId: string, certId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        proId: string;
        status: import(".prisma/client").$Enums.CertificationStatus;
        issuingOrg: string;
        issueDate: Date;
        expiryDate: Date | null;
        certificateUrl: string | null;
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
        icon: string;
        badgeType: string;
        earnedAt: Date;
    }[]>;
    awardBadge(proId: string, badgeType: string): Promise<{
        id: string;
        name: string;
        description: string;
        proId: string;
        icon: string;
        badgeType: string;
        earnedAt: Date;
    }>;
    private getBadgeConfig;
}
