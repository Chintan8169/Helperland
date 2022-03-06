using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace helperland.Migrations
{
    public partial class AddingRatingsAndFavouriteAndBlockedTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FavoriteAndBlocked",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TargetUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsFavorite = table.Column<bool>(type: "bit", nullable: false),
                    IsBlocked = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteAndBlocked", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteAndBlocked_AspNetUsers_TargetUserId",
                        column: x => x.TargetUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteAndBlocked_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    RatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceRequestId = table.Column<int>(type: "int", nullable: false),
                    RatingFrom = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RatingTo = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Ratings = table.Column<decimal>(type: "decimal(16,2)", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RatingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OnTimeArrival = table.Column<decimal>(type: "decimal(16,2)", nullable: false),
                    Friendly = table.Column<decimal>(type: "decimal(16,2)", nullable: false),
                    QualityOfService = table.Column<decimal>(type: "decimal(16,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.RatingId);
                    table.ForeignKey(
                        name: "FK_Ratings_AspNetUsers_RatingFrom",
                        column: x => x.RatingFrom,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Ratings_AspNetUsers_RatingTo",
                        column: x => x.RatingTo,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Ratings_ServiceRequests_ServiceRequestId",
                        column: x => x.ServiceRequestId,
                        principalTable: "ServiceRequests",
                        principalColumn: "ServiceRequestId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteAndBlocked_TargetUserId",
                table: "FavoriteAndBlocked",
                column: "TargetUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteAndBlocked_UserId",
                table: "FavoriteAndBlocked",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_RatingFrom",
                table: "Ratings",
                column: "RatingFrom");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_RatingTo",
                table: "Ratings",
                column: "RatingTo");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_ServiceRequestId",
                table: "Ratings",
                column: "ServiceRequestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteAndBlocked");

            migrationBuilder.DropTable(
                name: "Ratings");
        }
    }
}
