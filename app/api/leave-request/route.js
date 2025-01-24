// app/api/leave-request/route.js

// export async function GET() {
//   return new Response(JSON.stringify({ message: "Here are the products" }), {
//     status: 200,
//   });
// }
import { google } from "googleapis";
import nodemailer from "nodemailer";
import clientPromise from "../../lib/mongodb";

export async function POST(request) {
  const data = await request.json();
  if (data) {
    try {
      const client = await clientPromise;
      const db = client.db("MccollinsMedia");

      console.log("restaurant marketing:", data);

      const result = await db.collection("leaveRequestForms").insertOne(data); // Use insertOne
      console.log(result);

      // Add data to Google Sheets
      await addToGoogleSheet(data);

      // Send reminder email
      await sendReminderEmail(data);

      return new Response(
        JSON.stringify({ message: "Form added successfully" }),
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error("Error adding form:", error); // Log the error for debugging
      return new Response(
        JSON.stringify({ message: "Error adding form" }), // Updated error message
        {
          status: 500, // Use 500 for server errors
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ message: "No data provided" }), // Return a 400 for missing data
      {
        status: 400,
      }
    );
  }
}

// Function to add data to Google Sheets
async function addToGoogleSheet(data) {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
  );

  console.log("datase acas", credentials);
  const auth = new google.auth.GoogleAuth({
    // keyFile: "./leave-submit-ab9aed66637e.json",
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1LqdiMtgMI5KhSzlyNAoY-Y63ctgkCaW-qTnU1PHV0dk"; // Replace with your Google Sheet ID
  const range = "Sheet1!A2:E"; // Adjust the range to match your sheet structure

  // Format the start and end date to a readable format
  const formattedStartDate = new Date(data.startDate).toLocaleDateString(
    "en-GB"
  );
  const formattedEndDate = new Date(data.endDate).toLocaleDateString("en-GB");
  const formattedDate = new Date(data.date).toLocaleDateString("en-GB");

  const values = [
    [
      data.name,
      data.email,
      data.leaveType,
      formattedStartDate,
      formattedEndDate,
      data.noOfDays,
      data.reason,
      data.remarks,
      data.status,
      formattedDate,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });

  console.log("Data added to Google Sheet");
}

// Function to send reminder email
async function sendReminderEmail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "sahad@mccollinsmedia.com",
      pass: "muwjfkkhclpsvrgg",
    },
  });

  const mailOptions = {
    from: "sahad@mccollinsmedia.com",
    to: "meghna@mccollinsmedia.com",
    cc: "accounts@mccollinsmedia.com",
    subject: "New Leave Request Submitted",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">New Leave Request Submitted</h2>
      <p>Hi Sahad,</p>
      <p>A new leave request has been submitted. Below are the details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Leave Type</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            data.leaveType
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Start Date</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
            data.startDate
          ).toLocaleDateString("en-GB")}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">End Date</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
            data.endDate
          ).toLocaleDateString("en-GB")}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Number of Days</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            data.noOfDays
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Reason</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.reason}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Remarks</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.remarks}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Status</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.status}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Request Date</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
            data.date
          ).toLocaleDateString("en-GB")}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Please review the request and take the necessary actions.</p>
      <p>Best regards,<br>Leave Management System</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);

  console.log("Reminder email sent");
}
