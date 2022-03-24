using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace helperland.Migrations
{
    public partial class SettingServiceRequestAddressColumnRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequestAddresses_ServiceRequests_ServiceRequestId",
                table: "ServiceRequestAddresses");

            migrationBuilder.AlterColumn<int>(
                name: "ServiceRequestId",
                table: "ServiceRequestAddresses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequestAddresses_ServiceRequests_ServiceRequestId",
                table: "ServiceRequestAddresses",
                column: "ServiceRequestId",
                principalTable: "ServiceRequests",
                principalColumn: "ServiceRequestId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequestAddresses_ServiceRequests_ServiceRequestId",
                table: "ServiceRequestAddresses");

            migrationBuilder.AlterColumn<int>(
                name: "ServiceRequestId",
                table: "ServiceRequestAddresses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequestAddresses_ServiceRequests_ServiceRequestId",
                table: "ServiceRequestAddresses",
                column: "ServiceRequestId",
                principalTable: "ServiceRequests",
                principalColumn: "ServiceRequestId");
        }
    }
}
