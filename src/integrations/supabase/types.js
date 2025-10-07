// Supabase database structure converted to JavaScript
// All TypeScript types are removed since JS doesn't support type-only constructs

// Runtime JSON type comment (for reference)
// Json can be string, number, boolean, null, object, or array
// const Json = string | number | boolean | null | object | Array<Json>;

// Runtime Database structure
export const Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5",
  },
  public: {
    Tables: {},
    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {},
  },
};

// Runtime Constants
export const Constants = {
  public: {
    Enums: {},
  },
};

// Optional runtime helper functions (replace TS generics functionality)
export function getTable(schema = "public", tableName) {
  if (!Database[schema] || !Database[schema].Tables[tableName]) {
    console.warn(`Table ${tableName} does not exist in schema ${schema}`);
    return null;
  }
  return Database[schema].Tables[tableName];
}

export function getView(schema = "public", viewName) {
  if (!Database[schema] || !Database[schema].Views[viewName]) {
    console.warn(`View ${viewName} does not exist in schema ${schema}`);
    return null;
  }
  return Database[schema].Views[viewName];
}

export function getFunction(schema = "public", functionName) {
  if (!Database[schema] || !Database[schema].Functions[functionName]) {
    console.warn(`Function ${functionName} does not exist in schema ${schema}`);
    return null;
  }
  return Database[schema].Functions[functionName];
}

export function getEnum(schema = "public", enumName) {
  if (!Database[schema] || !Database[schema].Enums[enumName]) {
    console.warn(`Enum ${enumName} does not exist in schema ${schema}`);
    return null;
  }
  return Database[schema].Enums[enumName];
}

export function getCompositeType(schema = "public", typeName) {
  if (!Database[schema] || !Database[schema].CompositeTypes[typeName]) {
    console.warn(`Composite type ${typeName} does not exist in schema ${schema}`);
    return null;
  }
  return Database[schema].CompositeTypes[typeName];
}
