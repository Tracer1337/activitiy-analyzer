from __future__ import print_function
import pickle
import os.path
import click
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from analyzer.analyze import analyze

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of the spreadsheet.
SPREADSHEET_ID = '1gS2LnBTx9aME2LewwTP4wglLLNQLZpGNBm0r3pm1i28'
RANGE_NAME = 'A2:C'

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
CREDENTIALS_PATH = DIR_PATH + "\\credentials.json"
TOKEN_PATH = DIR_PATH + "\\token.pickle"

@click.command()
@click.option("--summary", is_flag=True)
def main(summary):
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    print("Logging in")

    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    print("Fetch sheet")

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        print("Run analyzer")
        analyze(values, summary=summary)

if __name__ == '__main__':
    main()