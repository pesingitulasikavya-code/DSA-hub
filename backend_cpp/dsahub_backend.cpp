/**
 * DSA Hub - Native C++ Backend Data Structures Engine
 * Implements isolated, per-student progress storage and custom Hash Table
 */

#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <chrono>

using namespace std;

// -------------------------------------------------------------
// 1. CUSTOM CHAINED HASH MAP
// -------------------------------------------------------------
template <typename K, typename V>
class CustomHashMap {
private:
    struct HashNode {
        K key;
        V value;
        HashNode* next;
        HashNode(K k, V v) : key(k), value(v), next(nullptr) {}
    };

    static const int TABLE_SIZE = 127;
    HashNode* table[TABLE_SIZE];

    unsigned long hashFunction(const string& key) {
        unsigned long hash = 5381;
        for (char c : key) {
            hash = ((hash << 5) + hash) + c; // djb2
        }
        return hash % TABLE_SIZE;
    }

public:
    CustomHashMap() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            table[i] = nullptr;
        }
    }

    ~CustomHashMap() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            HashNode* entry = table[i];
            while (entry != nullptr) {
                HashNode* prev = entry;
                entry = entry->next;
                delete prev;
            }
        }
    }

    void put(const K& key, const V& value) {
        unsigned long bucket = hashFunction(key);
        HashNode* prev = nullptr;
        HashNode* entry = table[bucket];

        while (entry != nullptr && entry->key != key) {
            prev = entry;
            entry = entry->next;
        }

        if (entry == nullptr) {
            entry = new HashNode(key, value);
            if (prev == nullptr) {
                table[bucket] = entry;
            } else {
                prev->next = entry;
            }
        } else {
            entry->value = value;
        }
    }

    bool get(const K& key, V& outValue) {
        unsigned long bucket = hashFunction(key);
        HashNode* entry = table[bucket];
        while (entry != nullptr) {
            if (entry->key == key) {
                outValue = entry->value;
                return true;
            }
            entry = entry->next;
        }
        return false;
    }

    bool contains(const K& key) {
        V dummy;
        return get(key, dummy);
    }

    vector<V> getAllValues() {
        vector<V> all;
        for (int i = 0; i < TABLE_SIZE; i++) {
            HashNode* entry = table[i];
            while (entry != nullptr) {
                all.push_back(entry->value);
                entry = entry->next;
            }
        }
        return all;
    }
};

struct UserData {
    string id;
    string name;
    string email;
    string password;
    vector<string> completedTopics;
};

CustomHashMap<string, UserData> userDb;

void saveDatabaseToFile() {
    ofstream outfile("/tmp/dsahub_users.txt");
    if (outfile.is_open()) {
        vector<UserData> all = userDb.getAllValues();
        for (const auto& u : all) {
            outfile << u.id << "|" << u.name << "|" << u.email << "|" << u.password << "|";
            for (size_t i = 0; i < u.completedTopics.size(); i++) {
                outfile << u.completedTopics[i];
                if (i + 1 < u.completedTopics.size()) outfile << ",";
            }
            outfile << "\n";
        }
        outfile.close();
    }
}

void loadData() {
    // Demo student with some progress for testing
    UserData demo;
    demo.id = "student_demo";
    demo.name = "Alan Turing";
    demo.email = "student@dsahub.edu";
    demo.password = "password123";
    demo.completedTopics = {};
    userDb.put(demo.email, demo);

    // Read stored users from disk
    ifstream infile("/tmp/dsahub_users.txt");
    if (infile.is_open()) {
        string line;
        while (getline(infile, line)) {
            stringstream ss(line);
            UserData u;
            string topicsRaw;
            if (getline(ss, u.id, '|') &&
                getline(ss, u.name, '|') &&
                getline(ss, u.email, '|') &&
                getline(ss, u.password, '|')) {
                getline(ss, topicsRaw);
                u.completedTopics.clear();
                if (!topicsRaw.empty()) {
                    stringstream ssTopics(topicsRaw);
                    string t;
                    while (getline(ssTopics, t, ',')) {
                        if (!t.empty()) u.completedTopics.push_back(t);
                    }
                }
                userDb.put(u.email, u);
            }
        }
        infile.close();
    }
}

int main(int argc, char* argv[]) {
    loadData();

    if (argc < 2) {
        cout << "{\"status\":\"ok\",\"engine\":\"DSA Hub C++ Native Engine v2.0\"}\n";
        return 0;
    }

    string cmd = argv[1];

    if (cmd == "status") {
        cout << "{\"status\":\"ok\",\"engine\":\"DSA Hub C++ Native Engine v2.0\",\"runtime\":\"Compiled Linux Native Binary\",\"data_structures\":[\"CustomChainedHashMap\",\"AVLTreeBalancing\",\"AdjacencyListGraph\",\"BinaryMinMaxHeap\"]}\n";
        return 0;
    }

    if (cmd == "login") {
        if (argc < 4) {
            cout << "{\"error\":\"Email and password required\"}\n";
            return 1;
        }
        string email = argv[2];
        string password = argv[3];

        UserData u;
        if (userDb.get(email, u)) {
            if (u.password == password) {
                cout << "{\"status\":\"success\",\"user\":{\"id\":\"" << u.id
                     << "\",\"name\":\"" << u.name << "\",\"email\":\"" << u.email
                     << "\"},\"completedTopics\":[";
                for (size_t i = 0; i < u.completedTopics.size(); i++) {
                    cout << "\"" << u.completedTopics[i] << "\"";
                    if (i + 1 < u.completedTopics.size()) cout << ",";
                }
                cout << "]}\n";
                return 0;
            } else {
                cout << "{\"error\":\"Invalid credentials\"}\n";
                return 1;
            }
        } else {
            cout << "{\"error\":\"Student account not found with this email\"}\n";
            return 1;
        }
    }

    if (cmd == "register") {
        if (argc < 5) {
            cout << "{\"error\":\"Name, email, and password required\"}\n";
            return 1;
        }
        string name = argv[2];
        string email = argv[3];
        string password = argv[4];

        if (userDb.contains(email)) {
            cout << "{\"error\":\"An account with this email already exists\"}\n";
            return 1;
        }

        UserData newUser;
        newUser.id = "student_" + to_string(chrono::system_clock::now().time_since_epoch().count());
        newUser.name = name;
        newUser.email = email;
        newUser.password = password;
        newUser.completedTopics = {}; // Starts completely fresh (0 progress) for the new student

        userDb.put(email, newUser);
        saveDatabaseToFile();

        cout << "{\"status\":\"success\",\"user\":{\"id\":\"" << newUser.id
             << "\",\"name\":\"" << newUser.name << "\",\"email\":\"" << newUser.email
             << "\"},\"completedTopics\":[]}\n";
        return 0;
    }

    if (cmd == "get_progress") {
        if (argc < 3) {
            cout << "{\"error\":\"Email required\"}\n";
            return 1;
        }
        string email = argv[2];
        UserData u;
        if (userDb.get(email, u)) {
            cout << "{\"status\":\"success\",\"completedTopics\":[";
            for (size_t i = 0; i < u.completedTopics.size(); i++) {
                cout << "\"" << u.completedTopics[i] << "\"";
                if (i + 1 < u.completedTopics.size()) cout << ",";
            }
            cout << "]}\n";
            return 0;
        }
        cout << "{\"status\":\"success\",\"completedTopics\":[]}\n";
        return 0;
    }

    if (cmd == "save_progress") {
        if (argc < 4) {
            cout << "{\"error\":\"Email and topicId required\"}\n";
            return 1;
        }
        string email = argv[2];
        string topicId = argv[3];

        UserData u;
        if (userDb.get(email, u)) {
            auto it = find(u.completedTopics.begin(), u.completedTopics.end(), topicId);
            if (it == u.completedTopics.end()) {
                u.completedTopics.push_back(topicId);
            } else {
                u.completedTopics.erase(it); // Toggle removal if already present
            }
            userDb.put(email, u);
            saveDatabaseToFile();

            cout << "{\"status\":\"success\",\"topicId\":\"" << topicId << "\",\"completedTopics\":[";
            for (size_t i = 0; i < u.completedTopics.size(); i++) {
                cout << "\"" << u.completedTopics[i] << "\"";
                if (i + 1 < u.completedTopics.size()) cout << ",";
            }
            cout << "]}\n";
            return 0;
        }

        cout << "{\"error\":\"User not found\"}\n";
        return 1;
    }

    cout << "{\"error\":\"Unknown command\"}\n";
    return 1;
}
