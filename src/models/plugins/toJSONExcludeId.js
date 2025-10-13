const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSONExcludeId = (schema) => {
  let transform;
  if (schema.options?.toJSON?.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = {
    virtuals: true,
    transform: (doc, ret, options) => {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path]?.options?.private) {
          deleteAtPath(ret, path.split('.'), 0);
        } else if (Array.isArray(ret[path])) {
          Object.keys(schema.paths[path]?.options?.type[0] || {}).forEach((subPath) => {
            if (schema.paths[path]?.options?.type[0][subPath]?.private) {
              ret[path].forEach((item) => {
                deleteAtPath(item, subPath.split('.'), 0);
              });
            }
          });
        }
      });

      delete ret._id;
      delete ret.__v;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  };
};

module.exports = toJSONExcludeId;
