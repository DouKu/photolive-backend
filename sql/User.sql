CREATE TABLE "public"."users" (
	"id" serial NOT NULL,
	"phone" varchar(20) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(512) NOT NULL,
	"nickname" varchar(30) NOT NULL,
	"realName" varchar(20) NOT NULL,
	"appSecret" varchar(512) NOT NULL,
	"avatar" varchar(512) NOT NULL,
	"sign" varchar(300) NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	PRIMARY KEY ("id")
)
WITH (OIDS=FALSE);

COMMENT ON COLUMN "public"."users"."id" IS '主键';
COMMENT ON COLUMN "public"."users"."phone" IS '电话';
COMMENT ON COLUMN "public"."users"."username" IS '登录名';
COMMENT ON COLUMN "public"."users"."password" IS '密码(加盐哈希)';
COMMENT ON COLUMN "public"."users"."nickname" IS '昵称';
COMMENT ON COLUMN "public"."users"."realName" IS '真实姓名';
COMMENT ON COLUMN "public"."users"."appSecret" IS 'jwt';
COMMENT ON COLUMN "public"."users"."avatar" IS '头像';
COMMENT ON COLUMN "public"."users"."sign" IS '个性签名';
COMMENT ON COLUMN "public"."users"."createdAt" IS '注册时间';