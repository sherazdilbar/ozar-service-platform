import { CertificationsService } from './certifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CertificationsController {
    private certificationsService;
    private prisma;
    constructor(certificationsService: CertificationsService, prisma: PrismaService);
    getCertifications(req: any): Promise<{
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
    addCertification(req: any, body: any): Promise<{
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
    updateCertification(req: any, id: string, body: any): Promise<{
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
    deleteCertification(req: any, id: string): Promise<{
        success: boolean;
    }>;
    getBadges(req: any): Promise<{
        id: string;
        name: string;
        description: string;
        proId: string;
        earnedAt: Date;
        badgeType: string;
        icon: string;
    }[]>;
    private getProProfile;
}
