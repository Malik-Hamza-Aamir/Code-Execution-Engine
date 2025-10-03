#include <bits/stdc++.h>
using namespace std;

{{USER_CODE}}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;

        try {
            stringstream ss(line);
            string token;
            vector<string> args;

            while (getline(ss, token, ',')) {
                token.erase(remove_if(token.begin(), token.end(), ::isspace), token.end());
                args.push_back(token);
            }

            auto ans = {{FUNCTION_NAME}};
            cout << ans << "\n";

        } catch (const exception &e) {
            cerr << "Error: " << e.what() << "\n";
        }
    }
    return 0;
}
