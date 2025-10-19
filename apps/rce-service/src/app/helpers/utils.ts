export const cppConverters: Record<string, string> = {
  "int"       : "(int)stoi",
  "long long" : "stoll",
  "double"    : "stod",
  "string"    : "$VAL$"
};

export const javaConverters: Record<string, string> = {
  "int"       : "Integer.parseInt",
  "long"      : "Long.parseLsong",
  "double"    : "Double.parseDouble",
  "boolean"   : "Boolean.parseBoolean",
  "String"    : "$VAL$"
};

export const jsConverters: Record<string, string> = {
  "number" : "Number",
  "string" : "String"
}