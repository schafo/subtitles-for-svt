#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import json

# LibreTranslate request
from urllib.parse import urlencode
from urllib.request import Request, urlopen

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        # self.send_header('Content-Type', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Server is responding!')

    def make_translation_request(self, original_text):
        url = '' # Set remote server URL here
        
        if not url:
            raise Exception("The URL for the remote translation server must be set.")

        post_fields = {
            'q': original_text,
            'source': "sv", # input language
            'target': "en", # target language
            'format': "text",
            'api_key': ""}

        request = Request(url, urlencode(post_fields).encode())
        json_response = urlopen(request).read().decode()
        return json.loads(json_response)

    def do_POST(self):
        self.send_response(200)
        content_len = int(self.headers.get('Content-Length'))
        post_body = self.rfile.read(content_len)
        r = json.loads(post_body.decode())
        original_text = r['q']
        self.end_headers()

        translated_text_response = self.make_translation_request(original_text)

        self.wfile.write(str.encode(json.dumps(translated_text_response)))

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)