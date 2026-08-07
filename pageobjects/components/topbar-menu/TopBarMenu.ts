import { Page } from "@playwright/test"
import { JobMenu } from "./JobMenu"
import { UserManagementMenu } from "./UserManagementMenu"
import { QualificationsMenu } from "./QualificationsMenu"

export class TopBarMenu {

    private readonly page: Page
    readonly userManagement: UserManagementMenu
    readonly job: JobMenu
    readonly qualifications: QualificationsMenu

    constructor(page: Page) {
        this.page = page
        this.userManagement = new UserManagementMenu(page)
        this.job = new JobMenu(page)
        this.qualifications = new QualificationsMenu(page)
    }
}